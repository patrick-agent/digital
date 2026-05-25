import Link from 'next/link';

export default function BlogCard({ url, title, description, date, thumbnail }) {
  return (
    <Link href={url} className="blog-card">
      <div className="blog-card-inner">
        {thumbnail && (
          <div className="blog-card-thumb">
            <img src={thumbnail} alt={title} loading="lazy" />
          </div>
        )}
        <div className="blog-card-body">
          <h3 className="blog-card-title">{title}</h3>
          <p className="blog-card-desc">{description}</p>
          <time className="blog-card-date">{date}</time>
        </div>
      </div>
    </Link>
  );
}
