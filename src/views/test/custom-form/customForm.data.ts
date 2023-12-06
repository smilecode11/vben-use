import { h } from 'vue';
import { FormSchema } from '@/components/Table';
import { ImageMultipleUpload } from '@/views/comps/upload/image/components/MultipleUploadWithDrag';

export const formSchema: FormSchema[] = [
  {
    field: 'field1',
    label: 'slot方式',
    component: 'Input',
    slot: 'customSlotWithMutipleUpload',
  },
  {
    field: 'field3',
    label: 'render',
    component: 'Input',
    render: ({ model, field }) => {
      return h(ImageMultipleUpload, {
        useDrag: true,
        value: model[field],
        maxCount: 3,
        onChange: (list: string[]) => {
          model[field] = list;
        },
      });
    },
  },
  {
    field: 'field4',
    label: 'component',
    component: 'ImageMultipleUpload',
    componentProps: {
      useDrag: true,
      maxCount: 2,
    },
  },
  {
    field: 'address',
    label: '选择地址',
    component: 'Input',
    slot: 'customSlotWithAddress',
  },
  {
    field: 'lat',
    label: '地址纬度',
    component: 'Input',
    show: false,
  },
  {
    field: 'lat',
    label: '地址纬度',
    component: 'Input',
    show: false,
  },
  {
    field: 'lng',
    label: '地址纬度',
    component: 'Input',
    show: false,
  },
  {
    field: 'distance',
    label: '周边范围',
    component: 'Input',
    show: false,
  },
];
