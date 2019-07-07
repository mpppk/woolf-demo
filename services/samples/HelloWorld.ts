import { LambdaFunction, Lamool } from 'lamool';
import { Woolf } from 'woolf';
import { IJobFuncOption } from 'woolf/src/job';
import { BaseSample } from './BaseSample';

const addNumLambdaFunction: LambdaFunction = (event, _, cb) => {
  const dataList = event.data instanceof Array ? event.data : [event.data];
  const isNumber = value => {
    return typeof value === 'number' && isFinite(value);
  };
  const addNum = isNumber(event.addNum) ? event.addNum : 1;

  setTimeout(() => {
    const numSum = dataList.reduce((sum, e) => sum + e.count, 0);
    cb(null, { count: numSum + addNum });
  }, 1000);
};

export default class HelloWorldSample implements BaseSample {
  private static generateJobFuncOptions(
    addNum: number
  ): Partial<IJobFuncOption> {
    return {
      FunctionName: `add ${addNum}`,
      Parameters: {
        addNum,
        'data.$': '$'
      }
    };
  }
  public title = 'HelloWorld';

  public async getWoolf(): Promise<Woolf> {
    const woolf = new Woolf(new Lamool());
    const job1 = woolf.newJob();
    await job1.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(1)
    );
    await job1.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(2)
    );
    const job2 = woolf.newJob();
    await job2.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(1)
    );
    const job3 = woolf.newJob();
    await job3.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(2)
    );
    woolf.addDependency(job1, job2);
    woolf.addDependency(job1, job3);
    const job4 = woolf.newJob();
    await job4.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(1)
    );
    await job4.addFunc(
      addNumLambdaFunction,
      HelloWorldSample.generateJobFuncOptions(2)
    );
    woolf.addDependency(job2, job4);
    woolf.addDependency(job3, job4);
    return woolf;
    // TODO:
    // const woolf = new Woolf();
    // const jobs = woolf.newJobs(4);
    // await jobs[0].addFuncs([sleepLambdaFunction, sleepLambdaFunction]);
    // await jobs[1].addFuncs([sleepLambdaFunction]);
    // await jobs[2].addFuncs([sleepLambdaFunction]);
    // woolf.addDependencies([jobs[0]], [jobs[1], jobs[2]]);
    // await job4.addFuncs([sleepLambdaFunction, sleepLambdaFunction]);
    // woolf.addDependency([jobs[1], jobs[2]], [jobs[3]]);
  }
}
