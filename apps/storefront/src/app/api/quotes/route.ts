import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import { quoteRequestSchema, validateRequest } from '@/lib/validations'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: quotes, error } = await supabase
      .from('quote_requests')
      .select('*, quote_files(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ quotes: quotes ?? [] })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const validation = validateRequest(quoteRequestSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, email, company, phone, service, material, quantity, notes, files } = validation.data
    const quoteNumber = `QT-${nanoid(10).toUpperCase()}`

    const { data: quote, error: quoteError } = await supabase
      .from('quote_requests')
      .insert({
        quote_number: quoteNumber,
        user_id: user?.id ?? null,
        name,
        email,
        company: company ?? null,
        phone: phone ?? null,
        service,
        material,
        quantity,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (quoteError) throw quoteError

    // Attach files if any
    if (files?.length) {
      const quoteFiles = files.map((file: {
        originalFilename: string; s3Key?: string; s3Bucket?: string; fileSize: number; fileType: string;
      }) => ({
        quote_request_id: quote.id,
        original_filename: file.originalFilename,
        stored_filename: file.s3Key?.split('/').pop() ?? file.originalFilename,
        s3_key: file.s3Key ?? `review/${quoteNumber}/${file.originalFilename}`,
        s3_bucket: file.s3Bucket ?? process.env.AWS_S3_BUCKET ?? 'review-attachments',
        file_size: file.fileSize,
        file_type: file.fileType,
      }))
      await supabase.from('quote_files').insert(quoteFiles)
    }

    return NextResponse.json(
      { message: 'Quote request submitted successfully', quoteNumber, quote },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 })
  }
}
