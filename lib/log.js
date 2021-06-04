let logContents = [];
export default function log(msg) {
  console.log(msg);
  logContents = [...logContents, msg];
  return logContents;
}
