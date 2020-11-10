export default {
  bind(el, binding, vnode, oldVnode) {
      //拖拽模态框
      var mouseStartPoint = {"left": 0, "top": 0};
      var mouseEndPoint   = {"left": 0, "top": 0};
      var mouseDragDown   = false;
      var oldP            = {"left": 0, "top": 0};
      var moveTarget;
      document.documentElement.off("mousedown", ".el-dialog__header")
      document.documentElement.on("mousedown", ".el-dialog__header", function (e) {
          if(e.target.tagName!='INPUT'){
              e.preventDefault();
          }
          _hide('.el-popper')
          if (_hasClass(e.target,"el-dialog__close") || e.target.tagName=='INPUT')//点关闭按钮不能移动对话框
              return;

          mouseDragDown   = true;
          moveTarget      =  _getParentNode(this,'el-dialog')[0];
          mouseStartPoint = {"left": e.clientX, "top": e.clientY};
          oldP            = _offset(moveTarget);

          document.documentElement.on("mouseup" ,function (e) {

              mouseDragDown   = false;
              moveTarget      = undefined;
              mouseStartPoint = {"left": 0, "top": 0};
              oldP            = {"left": 0, "top": 0};

              document.documentElement.off('mouseup');
              document.documentElement.off('mousemove')

          });
          document.documentElement.on("mousemove", ".el-dialog__wrapper", function (e) {
              if (!mouseDragDown || moveTarget == undefined)return;
              mouseEndPoint      = {"left": e.clientX, "top": e.clientY};
              mouseEndPoint.left = mouseEndPoint.left - (mouseStartPoint.left - oldP.left);//移动修正，更平滑
              mouseEndPoint.top  = mouseEndPoint.top - (mouseStartPoint.top - oldP.top);
              _setOffset(moveTarget,mouseEndPoint)

          });

      });

  }
}
