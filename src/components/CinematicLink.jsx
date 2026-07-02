import { Link } from "react-router-dom";
import { useCinematicTransition } from "../context/TransitionContext";

export default function CinematicLink({
  to,
  children,
  className,
  onClick,
  ...props
}) {
  const { startTransition } = useCinematicTransition();

  const handleClick = (e) => {
    e.preventDefault();

    onClick?.(e);

    startTransition(to);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}