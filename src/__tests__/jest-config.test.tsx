import { renderWithTheme } from '../test/utils/test-utils';
import { mockCharacter } from '../test/utils/mock-data';
import { setupApiMocks } from '../test/utils/api-mocks';

/**
 * Basic configuration test to verify Jest setup
 */
describe('Jest Configuration Test', () => {
  beforeEach(() => {
    setupApiMocks();
  });

  it('should run basic test', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    document.body.appendChild(div);
    
    expect(div.textContent).toBe('Hello World');
    expect(document.body.contains(div)).toBe(true);
    
    document.body.removeChild(div);
  });

  it('should render basic React component with Material-UI theme', () => {
    const TestComponent = () => <div data-testid="test">Test Component</div>;
    
    const { getByTestId } = renderWithTheme(<TestComponent />);
    
    expect(getByTestId('test').textContent).toBe('Test Component');
  });

  it('should have access to mock data', () => {
    expect(mockCharacter).toBeDefined();
    expect(mockCharacter.id).toBe(1);
    expect(mockCharacter.name).toBe('Rick Sanchez');
  });

  it('should mock fetch correctly', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ test: 'data' }),
    });

    const response = await fetch('test-url');
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith('test-url');
    expect(data).toEqual({ test: 'data' });
  });

  it('should mock localStorage', () => {
    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn().mockReturnValue('test-value');
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: mockSetItem,
        getItem: mockGetItem,
      },
    });

    localStorage.setItem('test', 'value');
    const value = localStorage.getItem('test');

    expect(mockSetItem).toHaveBeenCalledWith('test', 'value');
    expect(value).toBe('test-value');
  });
});