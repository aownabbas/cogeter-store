import React from 'react'
import Header from '../components/Header';
import Container from 'react-bootstrap/Container'

function Master({ children }) {
    return (
        <>
            <Header />
            <Container>
                {children}
            </Container>
        </>
    )
}

export default Master;