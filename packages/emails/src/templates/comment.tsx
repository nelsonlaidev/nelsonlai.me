import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

import Footer from '../components/footer'
import Logo from '../components/logo'

type CommentEmailTemplateProps = {
  comment: string
  commenter: {
    name: string
    image: string
  }
  date: string
  id: string
  post: {
    title: string
    url: string
  }
}

const CommentEmailTemplate = (props: CommentEmailTemplateProps) => {
  const { comment, commenter, date, id, post } = props

  return (
    <Html>
      <Head>
        <Font
          fontFamily='Geist'
          fallbackFontFamily='Arial'
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle='normal'
        />
      </Head>
      <Preview>New comment on the post "{post.title}" on nelsonlai.me</Preview>
      <Tailwind>
        <Body className='m-auto bg-white p-1'>
          <Container className='mx-auto w-full max-w-[660px] rounded-lg border border-solid border-[#e5e5e5] bg-white p-8 shadow-sm'>
            <Logo />
            <Section>
              <Text className='m-0 p-0 text-xl font-semibold text-gray-900'>New Comment on Your Blog Post</Text>
              <Text className='mx-0 mt-2 mb-0 p-0 text-base font-normal text-gray-500'>
                Someone has commented on{' '}
                <Link href={post.url} className='font-medium text-gray-900'>
                  {post.title}
                </Link>
              </Text>
            </Section>
            <Section className='mt-6 rounded-lg border border-solid border-[#e5e5e5] bg-gray-50 p-6'>
              <Row>
                <Column className='w-10'>
                  <Img
                    src={commenter.image}
                    width={40}
                    height={40}
                    className='rounded-full'
                    alt={`${commenter.name}'s avatar`}
                  />
                </Column>
                <Column>
                  <Text className='m-0 py-0 pr-0 pl-3 text-base font-medium text-gray-900'>{commenter.name}</Text>
                  <Text className='m-0 py-0 pr-0 pl-3 text-sm font-normal text-gray-500'>{date}</Text>
                </Column>
              </Row>
              <Text className='mx-0 mt-4 mb-0 p-0 text-base font-normal text-gray-700'>{comment}</Text>
            </Section>
            <Button
              className='mt-6 rounded-full bg-gray-900 px-8 py-2.5 align-middle text-sm font-medium text-white'
              href={`${post.url}?${id}`}
            >
              View Comment
            </Button>
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

CommentEmailTemplate.PreviewProps = {
  comment: 'This is exactly what I needed! The explanations are clear and concise. Thanks for sharing! 👏',
  commenter: {
    name: 'John Doe',
    image: 'https://nelsonlai.me/api/avatar/john-doe'
  },
  date: 'January 1, 2025',
  id: 'comment=1',
  post: {
    title: 'Understanding Modern Web Development',
    url: 'http://localhost:3000/blog/understanding-modern-web-development'
  }
} satisfies CommentEmailTemplateProps

export default CommentEmailTemplate
