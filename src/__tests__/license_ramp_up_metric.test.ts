// tests/license_ramp_up_metric.test.ts
import { license_ramp_up_metric } from '../license_ramp_up_metric';

describe('license_ramp_up_metric', () => {
  it('should return an array of metrics with GitHub', async () => {
    const repoURL = 'https://github.com/rpgeeganage/ifto'; // Adjust with a valid URL
    const metrics = await license_ramp_up_metric(repoURL);

    // You can add your assertions here to test the behavior
    expect(metrics).toHaveLength(3); // Assuming it returns an array of length 3
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1); 
    expect(metrics[2]).toBeLessThanOrEqual(1); 
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
    expect(metrics[2]).toBeGreaterThanOrEqual(0);
    //license score should be 0
    expect(metrics[0]).toEqual(0); 
  });
  it('should return an arary of metrics with npmjs URL', async () => {
    const repoURL = 'https://www.npmjs.com/package/helmet'; 
    const metrics = await license_ramp_up_metric(repoURL); 

    expect(metrics).toHaveLength(3); 
    //checks that it is between the right range
    expect(metrics[0]).toBeLessThanOrEqual(1); 
    expect(metrics[1]).toBeLessThanOrEqual(1); 
    expect(metrics[2]).toBeLessThanOrEqual(1); 
    expect(metrics[0]).toBeGreaterThanOrEqual(0); 
    expect(metrics[1]).toBeGreaterThanOrEqual(0);
    expect(metrics[2]).toBeGreaterThanOrEqual(0);
    //license score should be 0
    expect(metrics[0]).toEqual(0); 
  }); 
});

