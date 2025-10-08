import { registerKernel } from '@tensorflow/tfjs';
import { binomialFilterConfig } from './binomialFilter';
import { buildExtremasConfig } from './buildExtremas';
import { computeExtremaAnglesConfig } from './computeExtremaAngles';
import { computeExtremaFreakConfig } from './computeExtremaFreak';
import { computeFreakDescriptorConfig } from './computeFreakDescriptors';
import { computeLocalizationConfig } from './computeLocalization';
import { computeOrientationHistogramsConfig } from './computeOrientationHistograms';
import { downsampleBilinearConfig } from './downsampleBilinear';
import { extremaReductionConfig } from './extremaReduction';
import { smoothHistogramsConfig } from './smoothHistograms';
import { upsampleBilinearConfig } from './upsampleBilinear';

//export function Register(){
registerKernel(binomialFilterConfig);
registerKernel(buildExtremasConfig);
registerKernel(computeExtremaAnglesConfig);
registerKernel(computeExtremaFreakConfig);
registerKernel(computeFreakDescriptorConfig);
registerKernel(computeLocalizationConfig);
registerKernel(computeOrientationHistogramsConfig);
registerKernel(downsampleBilinearConfig);
registerKernel(extremaReductionConfig);
registerKernel(smoothHistogramsConfig);
registerKernel(upsampleBilinearConfig);
//}
