import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">AmmerVerse</div>
            <div className="navbar-links">
                <a href="#home" className="nav-link">Home</a>
                <a href="#about" className="nav-link">About</a>
                <a href="#projects" className="nav-link">Projects</a>
                <a href="#contact" className="nav-link">Contact</a>
            </div>
        </nav>
    );
}
