import { handler } from "./index.js";

const testEvent = {
  payload: "local test payload"
};

handler(testEvent).then((res) => {
  console.log("Lambda response:", res);
});
