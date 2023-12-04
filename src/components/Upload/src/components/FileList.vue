<script lang="tsx">
  import { fileListProps } from '../props';
  import { isFunction, isDef } from '@/utils/is';
  import { useSortable } from '@/hooks/web/useSortable';
  import { useModalContext } from '@/components/Modal/src/hooks/useModalContext';
  import { defineComponent, CSSProperties, watch, nextTick, ref, onMounted } from 'vue';
  import Sortable from 'sortablejs';

  export default defineComponent({
    name: 'FileList',
    props: fileListProps,
    setup(props, { emit }) {
      const modalFn = useModalContext();
      const sortableContainer = ref<HTMLTableSectionElement>();

      watch(
        () => props.dataSource,
        () => {
          nextTick(() => {
            modalFn?.redoModalHeight?.();
          });
        },
      );

      if (props.openDrag) {
        onMounted(() =>
          useSortable(sortableContainer, {
            ...props.dragOptions,
            onEnd: ({ oldIndex, newIndex }) => {
              // position unchanged
              if (oldIndex === newIndex) {
                return;
              }
              const { onAfterEnd } = props.dragOptions;

              if (isDef(oldIndex) && isDef(newIndex)) {
                const data = [...props.dataSource];

                const [oldItem] = data.splice(oldIndex, 1);
                data.splice(newIndex, 0, oldItem);

                nextTick(() => {
                  console.log('_drag', data);
                  emit('update:dataSource', data);
                  isFunction(onAfterEnd) && onAfterEnd(data);
                });
              }
            },
          }).initSortable(),
        );
      }

      //  TIP: 排序自定义逻辑
      if (props.useCustomDrag) {
        onMounted(() => {
          // console.log('_props.useCustomDrag');
          new Sortable(sortableContainer.value as any, {
            group: 'sortList',
            animation: 150,
            handle: '.handle',
            onEnd(evt) {
              // console.log('onEnd to', evt.to);
              const eles = evt.to.getElementsByTagName('tr');
              let newArr = [] as any[];
              for (let i = 0; i < eles.length; i++) {
                let url = eles[i].getAttribute('data-url');
                newArr.push(url);
              }
              // 抛出新的排序
              emit('sort', newArr);
            },
          });
        });
      }

      return () => {
        const { columns, actionColumn, dataSource } = props;
        const columnList = [...columns, actionColumn];
        return (
          // x scrollbar
          <div class="overflow-x-auto">
            <table class="file-table">
              <colgroup>
                {columnList.map((item) => {
                  const { width = 0, dataIndex, ifShow = true } = item;
                  const style: CSSProperties = {
                    width: `${width}px`,
                    minWidth: `${width}px`,
                  };
                  return ifShow && <col style={width ? style : {}} key={dataIndex} />;
                })}
              </colgroup>
              <thead>
                <tr class="file-table-tr">
                  {columnList.map((item) => {
                    const { title = '', align = 'center', dataIndex, ifShow = true } = item;
                    return (
                      ifShow && (
                        <th class={['file-table-th', align]} key={dataIndex}>
                          {title}
                        </th>
                      )
                    );
                  })}
                </tr>
              </thead>
              <tbody ref={sortableContainer}>
                {dataSource.map((record = {}, index) => {
                  return (
                    <tr
                      class="file-table-tr"
                      data-url={record.url}
                      key={`${index + record.name || ''}`}
                    >
                      {columnList.map((item) => {
                        const {
                          dataIndex = '',
                          customRender,
                          align = 'center',
                          ifShow = true,
                        } = item;
                        const render = customRender && isFunction(customRender);
                        return (
                          ifShow && (
                            <td class={['file-table-td break-all', align]} key={dataIndex}>
                              {render
                                ? customRender?.({ text: record[dataIndex], record })
                                : record[dataIndex]}
                            </td>
                          )
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  .file-table {
    width: 100%;
    border-collapse: collapse;

    .center {
      text-align: center;
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    &-th,
    &-td {
      padding: 12px 8px;
    }

    thead {
      background-color: @background-color-light;
    }

    table,
    td,
    th {
      border: 1px solid @border-color-base;
    }
  }
</style>
