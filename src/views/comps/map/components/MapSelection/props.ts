export const MapSelectionProps = {
  type: {
    type: String as PropType<'address' | 'address,distance'>,
    default: 'address',
  },
  value: {
    type: Object as PropType<{
      address: string;
      lng: string;
      lat: string;
      distance?: number;
    }>,
    default: () => ({
      address: '',
      lng: '',
      lat: '',
    }),
  },
};
