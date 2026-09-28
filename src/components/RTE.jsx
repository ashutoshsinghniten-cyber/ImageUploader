import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/wordcount'
import 'tinymce/skins/ui/oxide/skin.css'
function RTE({name, control, label, defaultValue=""}) {
  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
      <Controller 
        name={name || "content"}
        control={control}
        render ={({field: {onChange, value}}) => (
               <Editor
              value={value ?? defaultValue}
                  init={{
                      height: 500,
                      menubar: true,
                      license_key: 'gpl',
                      skin: false,
                      content_css: false,
                      plugins: [
                          "image",
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "wordcount",
                      ],
                      toolbar:
                          "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat",
                      content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                  }}
                      onEditorChange={onChange}
        />
        )}
      />
    </div>
  )
}

export default RTE
