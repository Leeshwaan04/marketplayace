import React from 'react'
import { buildPath, type Route } from './router'
import { useNavigate } from './navContext'

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: Route
}

/** Real <a href> (crawlable, middle-click works) that navigates without a page reload. */
export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const navigate = useNavigate()
  return (
    <a
      {...rest}
      href={buildPath(to)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
