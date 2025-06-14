import {
  DEFAULT_NESTED_DOC_DIR,
  DEFAULT_STATE_TYPE,
  DIVIDER_TYPE,
  STMT_RELATION,
  STMT_STATE,
  db,
  parser$1,
  styles
} from "./chunk-Q4U5QUK3.js";
import {
  render
} from "./chunk-7KCRV3UT.js";
import "./chunk-BG2JG4VL.js";
import "./chunk-YUDJ2LNA.js";
import "./chunk-OXCWMZWH.js";
import {
  Graph
} from "./chunk-WRGNAT2A.js";
import {
  common$1,
  configureSvgSize,
  getConfig,
  log$1,
  require_dayjs_min,
  require_dist,
  select_default,
  utils
} from "./chunk-4U2VA67N.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/mermaid/dist/stateDiagram-v2-d93cdb3a.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var SHAPE_STATE = "rect";
var SHAPE_STATE_WITH_DESC = "rectWithTitle";
var SHAPE_START = "start";
var SHAPE_END = "end";
var SHAPE_DIVIDER = "divider";
var SHAPE_GROUP = "roundedWithTitle";
var SHAPE_NOTE = "note";
var SHAPE_NOTEGROUP = "noteGroup";
var CSS_DIAGRAM = "statediagram";
var CSS_STATE = "state";
var CSS_DIAGRAM_STATE = `${CSS_DIAGRAM}-${CSS_STATE}`;
var CSS_EDGE = "transition";
var CSS_NOTE = "note";
var CSS_NOTE_EDGE = "note-edge";
var CSS_EDGE_NOTE_EDGE = `${CSS_EDGE} ${CSS_NOTE_EDGE}`;
var CSS_DIAGRAM_NOTE = `${CSS_DIAGRAM}-${CSS_NOTE}`;
var CSS_CLUSTER = "cluster";
var CSS_DIAGRAM_CLUSTER = `${CSS_DIAGRAM}-${CSS_CLUSTER}`;
var CSS_CLUSTER_ALT = "cluster-alt";
var CSS_DIAGRAM_CLUSTER_ALT = `${CSS_DIAGRAM}-${CSS_CLUSTER_ALT}`;
var PARENT = "parent";
var NOTE = "note";
var DOMID_STATE = "state";
var DOMID_TYPE_SPACER = "----";
var NOTE_ID = `${DOMID_TYPE_SPACER}${NOTE}`;
var PARENT_ID = `${DOMID_TYPE_SPACER}${PARENT}`;
var G_EDGE_STYLE = "fill:none";
var G_EDGE_ARROWHEADSTYLE = "fill: #333";
var G_EDGE_LABELPOS = "c";
var G_EDGE_LABELTYPE = "text";
var G_EDGE_THICKNESS = "normal";
var nodeDb = {};
var graphItemCount = 0;
var setConf = function(cnf) {
  const keys = Object.keys(cnf);
  for (const key of keys) {
    cnf[key];
  }
};
var getClasses = function(text, diagramObj) {
  diagramObj.db.extract(diagramObj.db.getRootDocV2());
  return diagramObj.db.getClasses();
};
function getClassesFromDbInfo(dbInfoItem) {
  if (dbInfoItem === void 0 || dbInfoItem === null) {
    return "";
  } else {
    if (dbInfoItem.classes) {
      return dbInfoItem.classes.join(" ");
    } else {
      return "";
    }
  }
}
function stateDomId(itemId = "", counter = 0, type = "", typeSpacer = DOMID_TYPE_SPACER) {
  const typeStr = type !== null && type.length > 0 ? `${typeSpacer}${type}` : "";
  return `${DOMID_STATE}-${itemId}${typeStr}-${counter}`;
}
var setupNode = (g, parent, parsedItem, diagramStates, diagramDb, altFlag) => {
  const itemId = parsedItem.id;
  const classStr = getClassesFromDbInfo(diagramStates[itemId]);
  if (itemId !== "root") {
    let shape = SHAPE_STATE;
    if (parsedItem.start === true) {
      shape = SHAPE_START;
    }
    if (parsedItem.start === false) {
      shape = SHAPE_END;
    }
    if (parsedItem.type !== DEFAULT_STATE_TYPE) {
      shape = parsedItem.type;
    }
    if (!nodeDb[itemId]) {
      nodeDb[itemId] = {
        id: itemId,
        shape,
        description: common$1.sanitizeText(itemId, getConfig()),
        classes: `${classStr} ${CSS_DIAGRAM_STATE}`
      };
    }
    const newNode = nodeDb[itemId];
    if (parsedItem.description) {
      if (Array.isArray(newNode.description)) {
        newNode.shape = SHAPE_STATE_WITH_DESC;
        newNode.description.push(parsedItem.description);
      } else {
        if (newNode.description.length > 0) {
          newNode.shape = SHAPE_STATE_WITH_DESC;
          if (newNode.description === itemId) {
            newNode.description = [parsedItem.description];
          } else {
            newNode.description = [newNode.description, parsedItem.description];
          }
        } else {
          newNode.shape = SHAPE_STATE;
          newNode.description = parsedItem.description;
        }
      }
      newNode.description = common$1.sanitizeTextOrArray(newNode.description, getConfig());
    }
    if (newNode.description.length === 1 && newNode.shape === SHAPE_STATE_WITH_DESC) {
      newNode.shape = SHAPE_STATE;
    }
    if (!newNode.type && parsedItem.doc) {
      log$1.info("Setting cluster for ", itemId, getDir(parsedItem));
      newNode.type = "group";
      newNode.dir = getDir(parsedItem);
      newNode.shape = parsedItem.type === DIVIDER_TYPE ? SHAPE_DIVIDER : SHAPE_GROUP;
      newNode.classes = newNode.classes + " " + CSS_DIAGRAM_CLUSTER + " " + (altFlag ? CSS_DIAGRAM_CLUSTER_ALT : "");
    }
    const nodeData = {
      labelStyle: "",
      shape: newNode.shape,
      labelText: newNode.description,
      // typeof newNode.description === 'object'
      //   ? newNode.description[0]
      //   : newNode.description,
      classes: newNode.classes,
      style: "",
      //styles.style,
      id: itemId,
      dir: newNode.dir,
      domId: stateDomId(itemId, graphItemCount),
      type: newNode.type,
      padding: 15
      //getConfig().flowchart.padding
    };
    nodeData.centerLabel = true;
    if (parsedItem.note) {
      const noteData = {
        labelStyle: "",
        shape: SHAPE_NOTE,
        labelText: parsedItem.note.text,
        classes: CSS_DIAGRAM_NOTE,
        // useHtmlLabels: false,
        style: "",
        // styles.style,
        id: itemId + NOTE_ID + "-" + graphItemCount,
        domId: stateDomId(itemId, graphItemCount, NOTE),
        type: newNode.type,
        padding: 15
        //getConfig().flowchart.padding
      };
      const groupData = {
        labelStyle: "",
        shape: SHAPE_NOTEGROUP,
        labelText: parsedItem.note.text,
        classes: newNode.classes,
        style: "",
        // styles.style,
        id: itemId + PARENT_ID,
        domId: stateDomId(itemId, graphItemCount, PARENT),
        type: "group",
        padding: 0
        //getConfig().flowchart.padding
      };
      graphItemCount++;
      const parentNodeId = itemId + PARENT_ID;
      g.setNode(parentNodeId, groupData);
      g.setNode(noteData.id, noteData);
      g.setNode(itemId, nodeData);
      g.setParent(itemId, parentNodeId);
      g.setParent(noteData.id, parentNodeId);
      let from = itemId;
      let to = noteData.id;
      if (parsedItem.note.position === "left of") {
        from = noteData.id;
        to = itemId;
      }
      g.setEdge(from, to, {
        arrowhead: "none",
        arrowType: "",
        style: G_EDGE_STYLE,
        labelStyle: "",
        classes: CSS_EDGE_NOTE_EDGE,
        arrowheadStyle: G_EDGE_ARROWHEADSTYLE,
        labelpos: G_EDGE_LABELPOS,
        labelType: G_EDGE_LABELTYPE,
        thickness: G_EDGE_THICKNESS
      });
    } else {
      g.setNode(itemId, nodeData);
    }
  }
  if (parent && parent.id !== "root") {
    log$1.trace("Setting node ", itemId, " to be child of its parent ", parent.id);
    g.setParent(itemId, parent.id);
  }
  if (parsedItem.doc) {
    log$1.trace("Adding nodes children ");
    setupDoc(g, parsedItem, parsedItem.doc, diagramStates, diagramDb, !altFlag);
  }
};
var setupDoc = (g, parentParsedItem, doc, diagramStates, diagramDb, altFlag) => {
  log$1.trace("items", doc);
  doc.forEach((item) => {
    switch (item.stmt) {
      case STMT_STATE:
        setupNode(g, parentParsedItem, item, diagramStates, diagramDb, altFlag);
        break;
      case DEFAULT_STATE_TYPE:
        setupNode(g, parentParsedItem, item, diagramStates, diagramDb, altFlag);
        break;
      case STMT_RELATION:
        {
          setupNode(g, parentParsedItem, item.state1, diagramStates, diagramDb, altFlag);
          setupNode(g, parentParsedItem, item.state2, diagramStates, diagramDb, altFlag);
          const edgeData = {
            id: "edge" + graphItemCount,
            arrowhead: "normal",
            arrowTypeEnd: "arrow_barb",
            style: G_EDGE_STYLE,
            labelStyle: "",
            label: common$1.sanitizeText(item.description, getConfig()),
            arrowheadStyle: G_EDGE_ARROWHEADSTYLE,
            labelpos: G_EDGE_LABELPOS,
            labelType: G_EDGE_LABELTYPE,
            thickness: G_EDGE_THICKNESS,
            classes: CSS_EDGE
          };
          g.setEdge(item.state1.id, item.state2.id, edgeData, graphItemCount);
          graphItemCount++;
        }
        break;
    }
  });
};
var getDir = (parsedItem, defaultDir = DEFAULT_NESTED_DOC_DIR) => {
  let dir = defaultDir;
  if (parsedItem.doc) {
    for (let i = 0; i < parsedItem.doc.length; i++) {
      const parsedItemDoc = parsedItem.doc[i];
      if (parsedItemDoc.stmt === "dir") {
        dir = parsedItemDoc.value;
      }
    }
  }
  return dir;
};
var draw = async function(text, id, _version, diag) {
  log$1.info("Drawing state diagram (v2)", id);
  nodeDb = {};
  diag.db.getDirection();
  const { securityLevel, state: conf } = getConfig();
  const nodeSpacing = conf.nodeSpacing || 50;
  const rankSpacing = conf.rankSpacing || 50;
  log$1.info(diag.db.getRootDocV2());
  diag.db.extract(diag.db.getRootDocV2());
  log$1.info(diag.db.getRootDocV2());
  const diagramStates = diag.db.getStates();
  const g = new Graph({
    multigraph: true,
    compound: true
  }).setGraph({
    rankdir: getDir(diag.db.getRootDocV2()),
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 8,
    marginy: 8
  }).setDefaultEdgeLabel(function() {
    return {};
  });
  setupNode(g, void 0, diag.db.getRootDocV2(), diagramStates, diag.db, true);
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = select_default("#i" + id);
  }
  const root = securityLevel === "sandbox" ? select_default(sandboxElement.nodes()[0].contentDocument.body) : select_default("body");
  const svg = root.select(`[id="${id}"]`);
  const element = root.select("#" + id + " g");
  await render(element, g, ["barb"], CSS_DIAGRAM, id);
  const padding = 8;
  utils.insertTitle(svg, "statediagramTitleText", conf.titleTopMargin, diag.db.getDiagramTitle());
  const bounds = svg.node().getBBox();
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;
  svg.attr("class", CSS_DIAGRAM);
  const svgBounds = svg.node().getBBox();
  configureSvgSize(svg, height, width, conf.useMaxWidth);
  const vBox = `${svgBounds.x - padding} ${svgBounds.y - padding} ${width} ${height}`;
  log$1.debug(`viewBox ${vBox}`);
  svg.attr("viewBox", vBox);
  const labels = document.querySelectorAll('[id="' + id + '"] .edgeLabel .label');
  for (const label of labels) {
    const dim = label.getBBox();
    const rect = document.createElementNS("http://www.w3.org/2000/svg", SHAPE_STATE);
    rect.setAttribute("rx", 0);
    rect.setAttribute("ry", 0);
    rect.setAttribute("width", dim.width);
    rect.setAttribute("height", dim.height);
    label.insertBefore(rect, label.firstChild);
  }
};
var renderer = {
  setConf,
  getClasses,
  draw
};
var diagram = {
  parser: parser$1,
  db,
  renderer,
  styles,
  init: (cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    db.clear();
  }
};
export {
  diagram
};
//# sourceMappingURL=stateDiagram-v2-d93cdb3a-GZ47YUZV.js.map
