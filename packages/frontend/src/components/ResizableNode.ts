import { Node, mergeAttributes } from '@tiptap/core';

export const ResizableNode = Node.create({
  name: 'resizableNode',
  group: 'block', // 텍스트 줄과 분리되어 삽입되도록 설정
  atom: true,     // 노드 전체를 하나의 단위로 취급 (글자처럼 쪼개지지 않음)
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { 
        default: '300px',
        // HTML 저장 시에도 width가 유지되도록 설정
        renderHTML: attributes => ({
          style: `width: ${attributes.width}`,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-resizable-image]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-resizable-image': '' }), 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-resizable-image', '');
      dom.style.cssText = `
        position: relative; 
        display: inline-block; 
        line-height: 0;
        width: ${node.attrs.width};
        border: 2px solid transparent;
      `;

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.style.width = '100%';
      img.style.display = 'block';

      const handle = document.createElement('div');
      handle.style.cssText = `
        position: absolute; right: 0; bottom: 0; width: 12px; height: 12px;
        background: #3b82f6; cursor: nwse-resize; z-index: 10;
        display: none; /* 기본적으로 숨김 */
      `;
      // contenteditable="false"를 주어야 에디터가 핸들을 텍스트로 인식하지 않습니다.
      handle.contentEditable = 'false';

      // 마우스 이벤트 핸들러 (인라인 타입을 피하기 위해 별도 선언 가능)
      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startWidth = dom.offsetWidth;
        let newWidth = startWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
          newWidth = startWidth + (moveEvent.clientX - startX);
          if (newWidth > 50) {
            dom.style.width = `${newWidth}px`;
          }
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          // 에디터 상태 업데이트
          if (typeof getPos === 'function') {
            editor.commands.command(({ tr }) => {
              tr.setNodeMarkup(getPos(), undefined, {
                ...node.attrs,
                width: `${newWidth}px`,
              });
              return true;
            });
          }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      handle.addEventListener('mousedown', onMouseDown);

      dom.appendChild(img);
      dom.appendChild(handle);

      // 노드가 선택되었을 때만 핸들 표시
      return {
        dom,
        selectNode: () => {
          dom.style.border = '2px solid #3b82f6';
          handle.style.display = 'block';
        },
        deselectNode: () => {
          dom.style.border = '2px solid transparent';
          handle.style.display = 'none';
        },
      };
    };
  },
});