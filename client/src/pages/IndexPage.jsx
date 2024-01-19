import axios from 'axios';
import Post from '../components/Post';
import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [newBlogs, setNewBlogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/blogs')
      .then(res => {
        console.log(res.data);
        setNewBlogs(res.data.blogs);
      })
      .catch(err => {
        console.log('An error occurred while fetching the posts');
      });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Latest</h2>
      {newBlogs.length > 0 ? (
        newBlogs.map((blog, index) => (
          <Post
            key={index}
            title={blog.title}
            summary={blog.summary}
            createdAt={blog.createdAt}
            content={blog.content}
            imageLink={blog.cover}
            author={blog.author.username}
            _id={blog._id}
          />
        ))
      ) : (
        <div>hello</div>
      )}
    </div>
  );
};

export default IndexPage;
