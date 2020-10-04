import { Button, Result } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import LayoutContent from '../shared/Layout/LayoutContent'

export const Error = () => {
    const location = useLocation()
    return (
        <LayoutContent>
              <Result
    status="404"
    title="404"
    subTitle={`Lo sentimos, la pagina ${location.pathname} no existe.`}
    extra={<Button type="primary"><Link to="/">Regresar al inicio</Link></Button>}
  />
        </LayoutContent>
    )
}
