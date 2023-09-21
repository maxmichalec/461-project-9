// tests/bus_factor_maintainer_metric.test.ts
import { bus_factor_maintainer_metric } from '../bus_factor_maintainer_metric';

describe('bus_factor_maintainer_metric', () => {
  it('should return an array of metrics with GitHub Url', async () => {
    const repoURL = 'https://github.com/rpgeeganage/ifto'; // Adjust with a valid URL
    const metrics = await bus_factor_maintainer_metric(repoURL);

    // You can add your assertions here to test the behavior
    expect(metrics).toHaveLength(2); // Assuming it returns an array of length 2
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1); 
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
  });
  it('should return an arary of metrics with npmjs URL', async () => {
    const repoURL = 'https://www.npmjs.com/package/helmet'; 
    const metrics = await bus_factor_maintainer_metric(repoURL); 

    expect(metrics).toHaveLength(2); 
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1);  
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
  });
  it('should return an array of 0s with invalid URL', async () => {
    const repoURL = 'https://www.google.com';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with invalid GitHub URL', async () => {
    const repoURL = 'https://www.github.com/maxmichalec/invalid';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with invalid npmjs URL', async () => {
    const repoURL = 'https://www.npmjs.com/package/thispackagedoesnotexist';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
  it('should return an array of 0s with private GitHub repository', async () => {
    const repoURL = 'https://github.com/maxmichalec/ece264';
    const metrics = await bus_factor_maintainer_metric(repoURL);

    expect(metrics).toHaveLength(2);
    expect(metrics[0]).toBe(0);
    expect(metrics[1]).toBe(0);
  });
});