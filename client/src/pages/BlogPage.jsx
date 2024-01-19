import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { format, parseISO } from 'date-fns';
import { UserContext } from "../components/UserContext";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
const BlogPage = () => {
    const { user } = useContext(UserContext)
    console.log(user)
    const [blog, setBlog] = useState(null);
    const { id } = useParams();
    let formattedDate = ''; // Declare formattedDate outside the if block
  
    useEffect(() => {
      axios.get(`http://localhost:4000/blogs/${id}`)
        .then(res => {
          console.log(res.data);
          setBlog(res.data.blog);
        })
        .catch(err => {
          console.log('error occurred ', err);
        });
    }, [id]);
  
    if (blog) {
      const dateObject = parseISO(blog.createdAt);
      formattedDate = format(dateObject, 'yyyy-MM-dd HH:mm');
    }
  
    if (blog == null) {
      return <div>Sorry not able to fetch at server</div>;
    }
  
    return (
      
      <div className="blog">
        <h3 className="blog-title">{blog.title}</h3>
        {user === blog.author.username && (
        <Link to='/edit/:id'><button className="edit-button"><EditIcon />Edit</button></Link>
      )}
        <span><time>{formattedDate}</time></span>
        <p>Written by {blog.author.username}</p>
        <img className="blog-cover" src={`http://localhost:4000/${blog.cover}`} alt='blog-pic' />
        <p className="blog-summary">{blog.summary}</p>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    );
  };
  
  export default BlogPage;
  