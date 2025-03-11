import { readFile, writeFile, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import OpenAI from 'openai'
import pangu from 'pangu'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

const summariesPath = path.join(import.meta.dirname, '..', 'summaries.json')
const postsDir = path.join(import.meta.dirname, '..', 'posts')

const summaries = existsSync(summariesPath)
  ? JSON.parse(await readFile(summariesPath, { encoding: 'utf-8' }))
  : {}
const postIds = (await readdir(postsDir, { withFileTypes: true }))
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

for (const postId of postIds) {
  // Skip if already summarized
  if (summaries[postId]) continue

  console.log('Summarizing post', postId)

  // Get summary from DeepSeek V3
  const markdown = await readFile(path.join(postsDir, postId, 'index.md'), { encoding: 'utf-8' })
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: '你需要为以下文章作出一段简短的摘要，不要在输出中包含 Markdown 格式。',
      },
      { role: 'user', content: markdown },
    ],
    model: 'deepseek-chat',
  })

  // Format and save summary
  const summary = pangu.spacing(completion.choices[0].message.content)
  summaries[postId] = summary
  await writeFile(summariesPath, JSON.stringify(summaries, null, 2), { encoding: 'utf-8' })
}
