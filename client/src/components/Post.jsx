import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';



const Post = ({ _id, title, summary, imageLink, createdAt, author = 'ayman' }) => {
  // Parse the ISO string to a Date object
  const dateObject = parseISO(createdAt);

  // Format the date using date-fns function
  const formattedDate = format(dateObject, 'yyyy-MM-dd HH:mm');

  return (
    <div className="post">
      <div className="image">
      <Link to={`/blog/${_id}`}>
        <img src={"http://localhost:4000/" + imageLink} alt="highway" />
      </Link>
      </div>
      <div className="content">
        <Link to={`/blog/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author}</a>
          <time>{formattedDate}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
