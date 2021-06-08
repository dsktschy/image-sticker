import path from 'path'
import { Browser, launch, Page } from 'puppeteer'

describe('E2E tests to see whether images are displayed', () => {
  // Expected behaviour of content script can't be gotten
  // without content_script settings in manifest.json
  // because of following reasons
  // - executeScript of extension fails on puppeteer
  // - chrome(browser).runtime is undefined
  //   in content script injected by addScriptTag of puppeteer
  // So create artifact for test in dist/test
  //
  // It can't be tested that default popup sends message to background
  // because executeScript of extension doesn't response
  const distPath = path.resolve(__dirname, '../../dist/test')
  const image1Path = path.resolve(__dirname, '../../public/images/icon16.png')
  const image2Path = path.resolve(__dirname, '../../public/images/icon128.png')
  const imagePathList = [image1Path, image2Path]
  const nonImage1Path = path.resolve(__dirname, '../../jest.config.js')
  const nonImage2Path = path.resolve(__dirname, '../../package.json')
  const nonImagePathList = [nonImage1Path, nonImage2Path]

  let browser: Browser | null = null
  let backgroundPage: Page | null = null
  let defaultPopupPage: Page | null = null
  let contentPage: Page | null = null

  beforeEach(async () => {
    // https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-working-with-chrome-extensions
    browser = await launch({
      args: [
        `--disable-extensions-except=${distPath}`,
        `--load-extension=${distPath}`
      ],
      headless: false
    })
    const targets = browser.targets()

    // Get background page to know entension ID from chrome object
    const backgroundTarget = targets.find(
      target => target.type() === 'background_page'
    )
    if (!backgroundTarget) return
    backgroundPage = await backgroundTarget.page()
    if (!backgroundPage) return
    const extensionId = await backgroundPage.evaluate<() => string>(
      /* eslint-disable */
      // @ts-ignore
      () => chrome.i18n.getMessage('@@extension_id')
      /* eslint-enable */
    )

    // Test default popup as page
    // because it can't be opened by clicking icon in puppeteer
    // https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-working-with-chrome-extensions
    const defaultPopupTarget = targets.find(target => target.type() === 'page')
    if (!defaultPopupTarget) return
    defaultPopupPage = await defaultPopupTarget.page()
    if (!defaultPopupPage) return
    await defaultPopupPage.goto(
      `chrome-extension://${extensionId}/default_popup.html`
    )

    contentPage = await browser.newPage()
    await contentPage.goto('https://google.com')
    await contentPage.bringToFront()
  })

  afterEach(async () => {
    if (!browser) return
    await browser.close()
  })

  const uploadFileToContentScriptInput = async (
    pathList: string[]
  ): Promise<void> => {
    if (!contentPage) throw new Error('NoContentPage')
    const $ContentScriptInput = await contentPage.$(
      '#imgstckr-ContentScript__input'
    )
    if (!$ContentScriptInput) throw new Error('NoContentScriptInput')
    await $ContentScriptInput.uploadFile(...pathList)
  }

  const uploadFileToDefaultPopupInput = async (
    pathList: string[]
  ): Promise<void> => {
    if (!defaultPopupPage) throw new Error('NoDefaultPopupPage')
    const $DefaultPopupInput = await defaultPopupPage.$(
      '#imgstckr-DefaultPopup__input'
    )
    if (!$DefaultPopupInput) throw new Error('NoDefaultPopupInput')
    await $DefaultPopupInput.uploadFile(...pathList)
  }

  const countStickerListChildren = async (): Promise<number> => {
    if (!contentPage) throw new Error('NoContentPage')
    const $StickerList = await contentPage.$('#imgstckr-StickerList')
    if (!$StickerList) throw new Error('NoStickerList')
    const $childElementCount = await $StickerList.getProperty(
      'childElementCount'
    )
    return $childElementCount ? await $childElementCount.jsonValue() : 0
  }

  test('whether images are displayed on active tab when default_popup is clicked and files are selected', async () => {
    // Handling file dialog can't be imitated, so test only change event
    await uploadFileToContentScriptInput(imagePathList)
    // Wait exchanging messages
    await new Promise(resolve => setTimeout(resolve, 100))
    const childElementCount = await countStickerListChildren()
    expect(childElementCount).toBe(imagePathList.length)
  })

  test('whether nothing is inserted to StickerList when non-image files are selected in file dialog', async () => {
    // Handling file dialog can't be imitated, so test only change event
    await uploadFileToContentScriptInput(nonImagePathList)
    // Wait exchanging messages
    await new Promise(resolve => setTimeout(resolve, 100))
    const childElementCount = await countStickerListChildren()
    expect(childElementCount).toBe(0)
  })

  test('whether images are displayed on active tab when image files are dropped to default_popup', async () => {
    // The dataTransfer property of DragEvent can't be set, so test only change event
    // https://ja.stackoverflow.com/questions/48184/
    // https://qiita.com/yuku_t/items/4ee557d01c6401b61be0
    await uploadFileToDefaultPopupInput(imagePathList)
    // Wait exchanging messages
    await new Promise(resolve => setTimeout(resolve, 100))
    const childElementCount = await countStickerListChildren()
    expect(childElementCount).toBe(imagePathList.length)
  })

  test('whether nothing is inserted to StickerList when non-image files are dropped to default_popup', async () => {
    // The dataTransfer property of DragEvent can't be set, so test only change event
    // https://ja.stackoverflow.com/questions/48184/
    // https://qiita.com/yuku_t/items/4ee557d01c6401b61be0
    await uploadFileToDefaultPopupInput(nonImagePathList)
    // Wait exchanging messages
    await new Promise(resolve => setTimeout(resolve, 100))
    const childElementCount = await countStickerListChildren()
    expect(childElementCount).toBe(0)
  })
})
