import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }
  // 富文本失去焦点的时候，将数据传递给父组件
  const onBlur = () => {
    // 将富文本编辑器里面的东西转为带html标签的字符串
    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    props.getContent(text)
  }

  useEffect(() => {
    // props.content：标签字符串，初始化将值显示在富文本编辑器里面
    if(props.content) {
      // 下面的代码区github网站的demo实例里面，解析富文本编辑器字符串，在编辑器里面展示
      // 富文本编辑器只接受draft对象
      // draftjs-to-html：富文本编辑器里面的内容 -> html标签字符串
      // html-to-draftjs：html标签字符串 -> 富文本编辑器里面的内容
      const contentBlock = htmlToDraft(props.content)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [props.content])

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperStyle={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          height: '320px',
          lineHeight: '15px',
          paddingLeft: '10px',
          overflow: 'auto'
        }}
        onEditorStateChange={onEditorStateChange}
        onBlur={onBlur}
      />
    </div>
  )
}
