interface Props {
  array: Array<any>;
  startIndex: number;
  endIndex: number;
}

export const paginateArray = ({ array, startIndex, endIndex }: Props) => {
  return array.slice(startIndex, endIndex);
};
