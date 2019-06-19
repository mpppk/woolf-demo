import { LambdaFunction, Lamool } from 'lamool';
import { Woolf } from 'woolf';
import { BaseSample } from './BaseSample';

const sleepLambdaFunction: LambdaFunction = (event, _, cb) => {
  setTimeout(() => {
    cb(null, event);
  }, 2000);
};

export default class HelloWorldSample implements BaseSample {
  public title = 'HelloWorld';
  public async getWoolf(): Promise<Woolf> {
    const woolf = new Woolf(new Lamool());
    const job1 = woolf.newJob();
    await job1.addFunc(sleepLambdaFunction);
    await job1.addFunc(sleepLambdaFunction);
    const job2 = woolf.newJob();
    await job2.addFunc(sleepLambdaFunction);
    const job3 = woolf.newJob();
    await job3.addFunc(sleepLambdaFunction);
    woolf.addDependency(job1, job2);
    woolf.addDependency(job1, job3);
    const job4 = woolf.newJob();
    await job4.addFunc(sleepLambdaFunction);
    await job4.addFunc(sleepLambdaFunction);
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
