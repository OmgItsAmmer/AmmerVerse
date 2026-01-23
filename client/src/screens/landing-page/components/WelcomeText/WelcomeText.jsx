import './WelcomeText.css';

export default function WelcomeText({ viewMode }) {
  // Only show on avatar screen (default mode)
  if (viewMode !== 'default') {
    return null;
  }

  return (
    <div className="welcome-text-container">
      <h1 className="welcome-text">
        Welcome to
        <br />
        <span className="ammerverse-highlight">AmmerVerse</span>
      </h1>
    </div>
  );
}
