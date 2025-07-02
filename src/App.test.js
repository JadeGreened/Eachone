import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HCI researcher title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Human-Computer/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders research areas section', () => {
  render(<App />);
  const researchTitle = screen.getByText(/研究领域/i);
  expect(researchTitle).toBeInTheDocument();
});

test('renders VR research area', () => {
  render(<App />);
  const vrTitle = screen.getByText(/虚拟现实/i);
  expect(vrTitle).toBeInTheDocument();
});

test('renders featured projects section', () => {
  render(<App />);
  const projectsTitle = screen.getByText(/精选项目/i);
  expect(projectsTitle).toBeInTheDocument();
});

test('renders publications section', () => {
  render(<App />);
  const publicationsTitle = screen.getByText(/学术论文/i);
  expect(publicationsTitle).toBeInTheDocument();
});

test('renders contact section', () => {
  render(<App />);
  const contactTitle = screen.getByText(/联系我/i);
  expect(contactTitle).toBeInTheDocument();
});
