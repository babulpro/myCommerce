// app/emails/WelcomeEmail.jsx
import React from 'react';
import { Html, Body, Container, Text, Heading } from '@react-email/components';

export default function WelcomeEmail({ firstName }) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to NextShop!</Heading>
          <Text style={paragraph}>Hello {firstName},</Text>
          <Text style={paragraph}>Thank you for joining NextShop!</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const h1 = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};