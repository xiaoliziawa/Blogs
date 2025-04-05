import {
  flowRendererV2,
  flowStyles
} from "./chunk-L37GITUM.js";
import "./chunk-3AUER6TY.js";
import {
  flowDb,
  parser$1
} from "./chunk-R3VIO3QA.js";
import "./chunk-ZHBJHRIG.js";
import "./chunk-TJQQXQK4.js";
import "./chunk-WUZFNOI6.js";
import "./chunk-RHXZFO4L.js";
import {
  require_dayjs_min,
  require_dist,
  setConfig
} from "./chunk-6UXMJKXP.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/mermaid/dist/flowDiagram-v2-96b9c2cf.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var diagram = {
  parser: parser$1,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};
export {
  diagram
};
//# sourceMappingURL=flowDiagram-v2-96b9c2cf-QPI2MJJK.js.map
