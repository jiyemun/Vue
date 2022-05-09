<template>
  <div class="relative !h-full w-full overflow-hidden" style="width:200vh; height:100vh" ref="element">
    <div id="container"></div>
    <div>
      <Button style="border: 1px solid #11111" @click="mapDownLoad()">DownLoad</Button>
      <Button style="border: 1px solid #11111" @click="Visible()">Visible</Button>
      <Button style="border: 1px solid #11111" @click="pointRemove()">pointRemove</Button>
      <Button style="border: 1px solid #11111" @click="lineRemove()">lineRemove</Button>
      <Button style="border: 1px solid #11111" @click="Visible()">Visible</Button>
    </div>
  </div>
</template>
<script lang="ts">
  import Konva from 'konva';
  import { defineComponent, onMounted, onBeforeMount, reactive, toRefs, ref, onUpdated } from 'vue';
  import map5_9 from './../assets/map.png';
  enum DRAW_TYPE {
    COMPLETESHAPE = 0,
    CUSTOMSHAPE,
  }
  enum CUS_MODE {
    ON = 0,
    OFF,
  }
  let stage: Konva.Stage | null = null;
  let gridGroup: Konva.Group | null = null;
  let mapLayer: Konva.Layer | null = null;
  let editorLayer: Konva.Layer | null = null;
  let tempLayer: Konva.Layer | null = null;
  let editorGrp: Konva.Group | null = null;
  let customEditorGrp: Konva.Group | null = null;
  let mapImage: Konva.Image | null = null;
  let tempObject: Konva.Shape | null = null;
  let tr: Konva.Transformer | null = null;
  let drawType = DRAW_TYPE.CUSTOMSHAPE;
  let cusMode = CUS_MODE.OFF;
  const element = ref(null);
  interface State {
    isInit: boolean;
    loading: boolean;
    intersectionObserverInstance: IntersectionObserver | null;
  }
  export default defineComponent({
    setup() {
      const state = reactive<State>({
        isInit: false,
        loading: false,
        intersectionObserverInstance: null,
      });
      function lineRemove() {
        let lines: Konva.Shape[] = customEditorGrp?.find('.pointLines');
        let line: Konva.Line = lines[lines.length - 1];
        line.points([]);
        line.remove();
      }
      function pointRemove() {
        if (customEditorGrp?.hasChildren()) {
          let removePoint: Konva.Shape = customEditorGrp.find('.pointCircle');
          if (removePoint.length > 0) {
            for (let i = 0; i < removePoint.length; i++) {
              removePoint[i].remove();
            }
          }
        }
      }
      function Visible() {
        if (gridGroup.visible()) {
          gridGroup.hide();
        } else {
          gridGroup.show();
        }
      }
      function mapDownLoad() {
        var link = document.createElement('a');
        link.download = 'from_canvas.png';
        link.href = mapLayer.getCanvas().toDataURL('image/png', 1.0);
        //link.href = stage.toDataURL({})
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      onBeforeMount(() => {});
      onMounted(() => {
        stage = new Konva.Stage({
          container: 'container',
          width: element.value.offsetWidth * 0.8,
          height: element.value.offsetHeight * 0.8,
        });
        stage.on('mousedown', (e) => {
          //tempObject = new Konva.Ci
          if (drawType == DRAW_TYPE.COMPLETESHAPE) {
          } else if (drawType == DRAW_TYPE.CUSTOMSHAPE) {
            let isIntersects: boolean = customEditorRect.intersects({
              x: e.evt.offsetX,
              y: e.evt.offsetY,
            });
            if (cusMode == CUS_MODE.ON && isIntersects == false) {
              tempObject = new Konva.Circle({
                name: 'pointCircle',
                x: e.evt.offsetX,
                y: e.evt.offsetY,
                radius: 10,
                fill: 'rgba(255,0,0, 0.4)',
                stroke: 'back',
                strokeWidth: 2,
              });
              customEditorGrp?.add(tempObject);
              let lines: Konva.Shape[] = customEditorGrp?.find('.pointLines');
              if (lines.length < 0) {
              } else {
                let line: Konva.Line = lines[lines.length - 1];
                let points: number[] = line.points();
                let length: number = points.length;
                let size: number = length * 0.5;
                if (size > 3) {
                  if (points[0] == points[length - 2] && points[1] == points[length - 1]) {
                    points.splice(length - 1, 1);
                    points.splice(length - 2, 1);
                  }
                }
                points.push(e.evt.offsetX);
                points.push(e.evt.offsetY);
                line.points(points);
                length = points.length;
                size = length * 0.5;
                if (size >= 3) {
                  points.push(points[0]);
                  points.push(points[1]);
                  line.points(points);
                }
              }
            }
            let lines: Konva.Shape[] = customEditorGrp?.find('.pointLines');
            if (lines.length > 0) {
              lines.forEach((Line) => {
                let result = Line.intersects({
                  x: e.evt.offsetX,
                  y: e.evt.offsetY,
                });
                console.log(Line.closed());
                if (result) {
                }
                console.log(result);
              });
            }
          }
        });
        stage.on('mousemove', (e) => {
          if (drawType == DRAW_TYPE.COMPLETESHAPE) {
            if (tempObject != null) {
              if (tempObject instanceof Konva.Rect) {
                tempObject.setAttrs({
                  name: 'tempRect',
                  x: e.evt.offsetX - tempObject.width() * 0.5,
                  y: e.evt.offsetY - tempObject.height() * 0.5,
                  stroke: 'black',
                  strokeWidth: 1,
                });
              }
              if (tempObject instanceof Konva.Circle) {
                tempObject.setAttrs({
                  name: 'tempCicle',
                  x: e.evt.offsetX,
                  y: e.evt.offsetY,
                  stroke: 'black',
                  strokeWidth: 1,
                });
              }
            }
          } else if (drawType == DRAW_TYPE.CUSTOMSHAPE) {
          }
        });
        let idIndex = 0;
        let selectId: string = null;
        stage.on('mouseup', (e) => {
          if (drawType == DRAW_TYPE.COMPLETESHAPE) {
            if (tempObject != null) {
              let editorRect: Konva.Rect = stage.find('#editorRect')[0];
              let isIntersects: boolean = editorRect.intersects({
                x: e.evt.offsetX,
                y: e.evt.offsetY,
              });
              if (isIntersects) {
                console.log('isIntersects');
              } else {
                if (tempObject instanceof Konva.Rect) {
                  let cloneRect: Konva.Rect = tempObject.clone({
                    x: e.evt.offsetX - e.target.width() * 0.5,
                    y: e.evt.offsetY - e.target.height() * 0.5,
                    id: 'clone' + idIndex++,
                  });
                  cloneRect.setDraggable(false);
                  cloneRect.off('mousedown');
                  cloneRect.on('mousedown', (e) => {});
                  cloneRect.on('mousemove', (e) => {});
                  cloneRect.on('mouseup', (e) => {
                    if (selectId != null && selectId != e.target.id()) {
                      let preRect: Konva.Shape = stage.find('#' + selectId)[0];
                      preRect.setDraggable(false);
                      e.target.draggable(true);
                      tr.detach();
                      tr.attachTo(e.target);
                      tr.update();
                    } else {
                      if (tr.getNode() == undefined) {
                        tr.attachTo(e.target);
                        e.target.setDraggable(true);
                      } else {
                        e.target.setDraggable(false);
                        tr.detach();
                        tr.update();
                      }
                    }
                    selectId = e.target.id();
                  });
                  cloneRect.on('transform', (e) => {
                    e.target.setAttrs({
                      width: Math.max(e.target.width() * e.target.scaleX(), 5),
                      height: Math.max(e.target.height() * e.target.scaleY(), 5),
                      scaleX: 1,
                      scaleY: 1,
                    });
                  });
                  editorGrp?.add(cloneRect);
                }
                if (tempObject instanceof Konva.Circle) {
                  console.log(' 2 ~~');
                  let cloneCircle: Konva.Circle = tempObject.clone({
                    x: e.evt.offsetX,
                    y: e.evt.offsetY,
                    id: 'clone' + idIndex++,
                  });
                  cloneCircle.setDraggable(false);
                  cloneCircle.off('mousedown');
                  cloneCircle.on('mousedown', (e) => {});
                  cloneCircle.on('mousemove', (e) => {});
                  cloneCircle.on('mouseup', (e) => {
                    if (selectId != null && selectId != e.target.id()) {
                      let preCircle: Konva.Shape = stage.find('#' + selectId)[0];
                      preCircle.setDraggable(false);
                      e.target.draggable(true);
                      tr.detach();
                      tr.attachTo(e.target);
                      tr.update();
                    } else {
                      if (tr.getNode() == undefined) {
                        tr.attachTo(e.target);
                        e.target.setDraggable(true);
                      } else {
                        e.target.setDraggable(false);
                        tr.detach();
                        tr.update();
                      }
                    }
                    selectId = e.target.id();
                  });
                  cloneCircle.on('transform', (e) => {
                    e.target.setAttrs({
                      width: Math.max(e.target.width() * e.target.scaleX(), 5),
                      height: Math.max(e.target.height() * e.target.scaleY(), 5),
                      scaleX: 1,
                      scaleY: 1,
                    });
                  });
                  editorGrp?.add(cloneCircle);
                }
              }
              if (tempObject instanceof Konva.Shape) {
                console.log(' 3 ~~');
              }
              if (tempObject != null) {
                tempObject?.remove();
                tempObject.destroy();
                tempObject = null;
              }
              if (tempLayer?.hasChildren()) {
                tempLayer?.removeChildren();
              }
            }
          } else if (drawType == DRAW_TYPE.CUSTOMSHAPE) {
          }
        });
        mapLayer = new Konva.Layer({
          id: 'mapLayer',
        });
        tr = new Konva.Transformer({ ignoreStroke: true });
        editorLayer = new Konva.Layer({
          id: 'editorLayer',
        });
        tempLayer = new Konva.Layer({
          id: 'tempLayer',
        });
        gridGroup = new Konva.Group({
          id: 'gridGroup',
        });
        gridGroup.hide();
        editorGrp = new Konva.Group({
          id: 'editorGrp',
        });
        editorGrp.on('mousedown', (e) => {
          console.log('editorGrp : mousedown');
          drawType = DRAW_TYPE.COMPLETESHAPE;
        });
        let editorRect: Konva.Rect = new Konva.Rect({
          id: 'editorRect',
          x: 10,
          y: 10,
          width: 100,
          height: 200,
          fill: 'rgba(199, 253, 255,0.8)',
          stroke: 'black',
          strokeWidth: 2,
        });
        let sR_x: number =
          (editorRect.width() - editorRect.width() * 0.5) * 0.5 +
          editorRect.x() -
          editorRect.strokeWidth();
        let sR_y: number = editorRect.y() + 10;
        let sRect: Konva.Rect = new Konva.Rect({
          x: sR_x,
          y: sR_y,
          width: editorRect.width() * 0.5,
          height: editorRect.width() * 0.5,
          fill: 'rgba(7,237,30,0.4)',
          stroke: 'black',
          strokeWidth: 2,
        });
        sRect.on('mousedown', (e) => {
          drawType = DRAW_TYPE.COMPLETESHAPE;
          tempObject = e.target.clone({
            x: e.evt.offsetX - e.target.width() * 0.5,
            y: e.evt.offsetY - e.target.height() * 0.5,
          });
          tempLayer?.add(tempObject);
        });
        let circleX: number = sRect.x();
        let editorCircle: Konva.Circle = new Konva.Circle({
          x: circleX + sRect.width() * 0.5,
          y: sRect.y() + sRect.height() + 10 + sRect.width() * 0.5,
          radius: sRect.width() * 0.5,
          fill: 'rgba(255,0,0, 0.4)',
          stroke: 'back',
          strokeWidth: 2,
        });
        editorCircle.on('mousedown', (e) => {
          drawType = DRAW_TYPE.COMPLETESHAPE;
          tempObject = e.target.clone({
            x: e.evt.offsetX,
            y: e.evt.offsetY,
          });
          tempLayer?.add(tempObject);
        });
        editorGrp.add(editorRect);
        editorGrp.add(sRect);
        editorGrp.add(editorCircle);
        editorLayer.add(editorGrp);
        customEditorGrp = new Konva.Group({
          id: 'customShapeGrp',
        });
        /*
        customEditorGrp.add(
          new Konva.Line({
            id: 'pointLine',
            points: [],
            stroke: 'red',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
          }),
        );
         */
        customEditorGrp.on('mousedown', (e) => {
          drawType = DRAW_TYPE.CUSTOMSHAPE;
        });
        let customEditorRect: Konva.Rect = new Konva.Rect({
          id: 'customEditorRect',
          x: editorRect.x(),
          y: editorRect.height() + editorRect.y() + 20,
          width: 100,
          height: 200,
          fill: 'rgba(199, 253, 255,0.8)',
          stroke: 'black',
          strokeWidth: 2,
        });
        let c_x: number =
          (customEditorRect.width() - customEditorRect.width() * 0.5) * 0.5 +
          customEditorRect.x() -
          customEditorRect.strokeWidth();
        let c_y: number = customEditorRect.y() + 10;
        let csRect: Konva.Rect = new Konva.Rect({
          x: c_x,
          y: c_y,
          width: customEditorRect.width() * 0.5,
          height: customEditorRect.width() * 0.5,
          fill: 'rgba(7,237,30,0.4)',
          stroke: 'black',
          strokeWidth: 2,
        });
        csRect.on('mousedown', (e) => {
          if (csRect.strokeWidth() == 2) {
            csRect.setAttrs({
              strokeWidth: 4,
            });
            cusMode = CUS_MODE.ON;
            customEditorGrp.add(
              new Konva.Line({
                name: 'pointLines',
                points: [],
                stroke: 'red',
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
              }),
            );
          } else {
            cusMode = CUS_MODE.OFF;
            csRect.setAttrs({
              strokeWidth: 2,
            });
            let lines: Konva.Shape[] = customEditorGrp?.find('.pointLines');
            if (lines.length < 0) {
            } else {
              pointRemove();
              let line: Konva.Line = lines[lines.length - 1];
              line.closed(true);
              tr.detach();
              tr.attachTo(line);
              tr.update();
            }
          }
        });
        customEditorGrp.add(customEditorRect);
        customEditorGrp.add(csRect);
        editorLayer.add(customEditorGrp);
        let mapImg: HTMLImageElement = new Image();
        mapImg.onload = () => {
          let drawWidth: number = mapImg.width;
          let drawHeight: number = mapImg.height;
          if (mapImg.width > stage.width()) {
            drawWidth = stage?.width();
          }
          mapImage = new Konva.Image({
            x: stage.width() / 2 - drawWidth / 2,
            y: 0,
            image: mapImg,
            width: drawWidth,
            height: drawHeight,
            draggable: false,
            id: 'mapImage',
            alpha: 0.3,
          });
          mapLayer?.add(mapImage);
          mapLayer?.add(gridGroup);
          mapLayer?.add(editorGrp);
          mapLayer?.add(tr);
        };
        let bounds = {
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
        };
        JSON.stringify(bounds, undefined, 4);
        let drawxLine = 50;
        let drawyLine = 50;
        let xGap: number = (bounds.width - bounds.x) / drawxLine;
        let yGap: number = (bounds.height - bounds.y) / drawyLine;
        for (let y: number = yGap; y < drawyLine * yGap; y += yGap) {
          gridGroup.add(
            new Konva.Line({
              stroke: 'rgba(0,0,0,0.3)',
              points: [0, y, stage.width(), y],
              strokeWidth: 0.5,
            }),
          );
        }
        for (let x: number = xGap; x < drawxLine * xGap; x += xGap) {
          gridGroup.add(
            new Konva.Line({
              stroke: 'rgba(0,0,0,0.5)',
              points: [x, 0, x, stage.height()],
              strokeWidth: 0.5,
            }),
          );
        }
        mapImg.src = map5_9;
        stage.add(mapLayer);
        stage.add(editorLayer);
        stage.add(tempLayer);
      });
      return {
        state,
        mapDownLoad,
        pointRemove,
        lineRemove,
        Visible,
        element,
      };
    },
  });
</script>