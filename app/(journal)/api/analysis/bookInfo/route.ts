import { NextResponse } from 'next/server'

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY
const GOOGLE_BOOKS_API_URL = process.env.GOOGLE_BOOKS_API_URL

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const bookTitle = searchParams.get('title')
        const bookAuthor = searchParams.get('author')

        if (!bookTitle || !bookAuthor) {
            return NextResponse.json(
                { error: 'Book title and author are required' },
                { status: 400 }
            )
        }

        const response = await fetch(
            `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(bookTitle)}+inauthor:${encodeURIComponent(bookAuthor)}&key=${GOOGLE_BOOKS_API_KEY}`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch from Google Books API')
        }

        const data = await response.json()

        if (!data.items || data.items.length === 0) {
            return NextResponse.json(
                { error: 'No books found' },
                { status: 404 }
            )
        }

        // Extract relevant information from the first result
        const book = data.items[0].volumeInfo
        const accessInfo = data.items[0].accessInfo

        const bookInfo = {
            book,
            accessInfo,
        }

        return NextResponse.json(bookInfo)

    } catch (error) {
        console.error('Error fetching book info:', error)
        return NextResponse.json(
            { error: 'Failed to fetch book information' },
            { status: 500 }
        )
    }
}
