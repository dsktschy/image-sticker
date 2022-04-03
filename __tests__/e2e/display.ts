import path from 'path'
import { Browser, launch, Page } from 'puppeteer'

describe('E2E tests to see whether images are displayed correctly', () => {
  const distPath = path.resolve(__dirname, '../../dist/test')
  const image1Path = path.resolve(__dirname, '../../public/images/icon16.png')
  const image2Path = path.resolve(__dirname, '../../public/images/icon128.png')
  const imagePathList = [image1Path, image2Path]
  const nonImage1Path = path.resolve(__dirname, '../../jest.config.js')
  const nonImage2Path = path.resolve(__dirname, '../../package.json')
  const nonImagePathList = [nonImage1Path, nonImage2Path]

  let browser: Browser | null = null
  let defaultPopupPage: Page | null = null
  let contentPage: Page | null = null

  beforeAll(async () => {
    // https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-working-with-chrome-extensions
    browser = await launch({
      args: [
        `--disable-extensions-except=${distPath}`,
        `--load-extension=${distPath}`
      ],
      headless: false
    })
    // Wait creating background service worker
    await new Promise(resolve => setTimeout(resolve, 100))
    const targets = browser.targets()

    // Get background service worker to know entension ID from chrome object
    // https://tweak-extension.com/blog/complete-guide-test-chrome-extension-puppeteer/#launch-puppeteer
    const backgroundTarget = targets.find(
      target => target.type() === 'service_worker'
    )
    if (!backgroundTarget) throw new Error('NoBackgroundTarget')
    const partialExtensionUrl = backgroundTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')

    // Test default popup as page
    // because it can't be opened by clicking icon in puppeteer
    // https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-working-with-chrome-extensions
    // But script execution can't be tested because it doesn't response
    const defaultPopupTarget = targets.find(target => target.type() === 'page')
    if (!defaultPopupTarget) throw new Error('NoDefaultPopupTarget')
    defaultPopupPage = await defaultPopupTarget.page()
    if (!defaultPopupPage) throw new Error('NoDefaultPopupPage')
    await defaultPopupPage.goto(
      `chrome-extension://${extensionId}/default_popup.html`,
      { waitUntil: 'load' }
    )

    contentPage = await browser.newPage()
    if (!contentPage) throw new Error('NoContentPage')
    await contentPage.goto('https://google.com', { waitUntil: 'load' })
    await contentPage.bringToFront()
  })

  beforeEach(async () => {
    if (!contentPage) throw new Error('NoContentPage')
    await contentPage.reload({ waitUntil: 'load' })
  })

  afterAll(async () => {
    if (!browser) throw new Error('NoBrowser')
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
