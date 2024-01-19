import axios from 'axios';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';  // Import useHistory
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{'header':[1, 2, false]}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'link', 'image', 'video'
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [redirect, setRedirect] = useState(false)

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', file);

    axios.post('http://localhost:4000/create', data, {
    withCredentials: true
})
    .then(res => {
        console.log('success', res.data);
        // Navigate to the home page on successful post creation
        setRedirect(true);
    })
    .catch(err => {
        console.log('an error occurred.', err);
    });

  };
  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    
    <div>
      <form onSubmit={handleCreatePost}>
        <input type='text' value={title} onChange={handleTitleChange} placeholder='Title' />
        <input type='text' value={summary} onChange={handleSummaryChange} placeholder='Summary' />
        <input type='file' onChange={handleFileChange} />
        <ReactQuill 
          value={content} 
          placeholder='write mf' 
          modules={modules} 
          formats={formats}
          onChange={newValue => setContent(newValue)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
