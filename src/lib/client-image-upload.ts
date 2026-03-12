import { uploadImageAction } from '@/app/actions/upload'

const MAX_WIDTH = 1600
const MAX_HEIGHT = 1600
const OUTPUT_TYPE = 'image/jpeg'
const OUTPUT_QUALITY = 0.82

export async function compressImage(file: File): Promise<File> {
    const dataUrl = await readFileAsDataUrl(file)
    const image = await loadImage(dataUrl)

    const canvas = document.createElement('canvas')
    const { width, height } = resizeDimensions(image.width, image.height)

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
        throw new Error('画像の変換に失敗しました')
    }

    context.drawImage(image, 0, 0, width, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) {
                    resolve(result)
                    return
                }
                reject(new Error('画像の圧縮に失敗しました'))
            },
            OUTPUT_TYPE,
            OUTPUT_QUALITY
        )
    })

    const nextName = `${file.name.replace(/\.[^/.]+$/, '')}.jpg`
    return new File([blob], nextName, { type: OUTPUT_TYPE })
}

export async function uploadCompressedImage(file: File, bucket: string) {
    const compressed = await compressImage(file)
    const formData = new FormData()
    formData.append('file', compressed)
    formData.append('bucket', bucket)

    const result = await uploadImageAction(formData)
    if (typeof result === 'object' && result.error) {
        throw new Error(result.error)
    }

    return result as string
}

function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result as string)
        reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
        reader.readAsDataURL(file)
    })
}

function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
        image.src = src
    })
}

function resizeDimensions(width: number, height: number) {
    let nextWidth = width
    let nextHeight = height

    if (nextWidth > nextHeight && nextWidth > MAX_WIDTH) {
        nextHeight *= MAX_WIDTH / nextWidth
        nextWidth = MAX_WIDTH
    } else if (nextHeight > MAX_HEIGHT) {
        nextWidth *= MAX_HEIGHT / nextHeight
        nextHeight = MAX_HEIGHT
    }

    return {
        width: Math.round(nextWidth),
        height: Math.round(nextHeight)
    }
}
