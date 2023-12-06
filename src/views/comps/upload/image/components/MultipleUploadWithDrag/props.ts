export const multipleUploadProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  action: {
    type: String as PropType<string>,
    default: 'http://127.0.0.1:7001/vben/api/utils/uploadImage',
  },
  maxCount: {
    type: Number as PropType<number>,
    default: 8,
  },
  useDrag: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};
