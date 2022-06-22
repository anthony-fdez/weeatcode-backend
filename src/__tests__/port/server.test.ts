import config from 'config';

const PORT = parseInt(config.get('PORT'), 10);
describe('PORT test', () => {
  describe('while running, the port,', () => {
    it('should be on port 3001', () => {
      expect(PORT).toBe(3001);
    });
  });
});
