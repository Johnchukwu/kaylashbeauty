import Link from "next/link";
import { SocialLinks } from "@/components/social-links";

type StoreFooterProps = { id: string };

export function StoreFooter({ id }: StoreFooterProps) {
  return (
    <footer className="collectionFooter" id={id}>
      <div className="collectionFooterInner pageWidth">
        <div>
          <SocialLinks className="collectionSocials" />
          <h3>Contact</h3>
          <a href="tel:+23409011303399">+23409011303399</a>
          <a href="mailto:chidalumbakwe2003@gmail.com">chidalumbakwe2003@gmail.com</a>
        </div>
        <div>
          <h3>My Account</h3>
          <a href="#">Sign in</a>
          <a href="#">Register</a>
          <a href="#">Order status</a>
        </div>
        <div>
          <h3>Shop</h3>
          <Link href="/collection">Lipgloss Collection</Link>
          <Link href="/lip-care">Lip Care Essentials</Link>
        </div>
      </div>
      <p className="collectionCopyright">Copyright ©2026. All Rights Reserved</p>
    </footer>
  );
}
