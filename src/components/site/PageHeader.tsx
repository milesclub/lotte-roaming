import Container from './Container'

// Inner-page title block.
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="page-header">
      <Container className="page-header__inner">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__sub">{subtitle}</p>}
      </Container>
    </div>
  )
}
