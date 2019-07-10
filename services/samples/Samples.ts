import { BaseSample } from './BaseSample';
import HelloWorldSample from './HelloWorld';

export enum SampleName {
  HelloWorld = 'HelloWorld',
  OffloadToAWSLambda = 'OffloadToAWSLambda'
}

export const getSampleNames = () => {
  return [SampleName.HelloWorld, SampleName.OffloadToAWSLambda];
};

export const getSample = (sampleName: SampleName): BaseSample => {
  switch (sampleName) {
    case SampleName.HelloWorld:
      return new HelloWorldSample();
    case SampleName.OffloadToAWSLambda:
      return new HelloWorldSample();
    default:
      // @ts-ignore
      const _: never = sampleName;
  }
};
