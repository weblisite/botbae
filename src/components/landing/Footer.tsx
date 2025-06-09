
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-16 botbae-container border-t border-muted mt-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4">
            Botbae
          </h3>
          <p className="text-white/70 mb-4">
            Your personalized AI companion for emotional support and meaningful connection.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-white/70 hover:text-botbae-accent transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="text-white/70 hover:text-botbae-accent transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-botbae-accent transition-colors">Contact</Link></li>
            <li><Link to="/blog" className="text-white/70 hover:text-botbae-accent transition-colors">Blog</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/help-center" className="text-white/70 hover:text-botbae-accent transition-colors">Help Center</Link></li>
            <li><Link to="/tutorials" className="text-white/70 hover:text-botbae-accent transition-colors">Tutorials</Link></li>
            <li><Link to="/documentation" className="text-white/70 hover:text-botbae-accent transition-colors">Documentation</Link></li>
            <li><Link to="/api" className="text-white/70 hover:text-botbae-accent transition-colors">API</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/terms" className="text-white/70 hover:text-botbae-accent transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-white/70 hover:text-botbae-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/cookies" className="text-white/70 hover:text-botbae-accent transition-colors">Cookie Policy</Link></li>
            <li><Link to="/gdpr" className="text-white/70 hover:text-botbae-accent transition-colors">GDPR Compliance</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-muted text-center text-white/50 text-sm">
        <p>&copy; {new Date().getFullYear()} Botbae. All rights reserved.</p>
      </div>
    </footer>
  );
}
