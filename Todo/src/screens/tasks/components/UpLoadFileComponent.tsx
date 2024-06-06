import {Slider} from '@miblanchard/react-native-slider';
import storage from '@react-native-firebase/storage';
import {DocumentUpload} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import RowComponent from '../../../components/RowComponent';
import SpaceComponent from '../../../components/SpaceComponent';
import TextComponent from '../../../components/TextComponent';
import TitleComponent from '../../../components/TitleComponent';
import {colors} from '../../../constants/colors';
import {AttachmentModel} from '../../../models/AttachmentModel';
import {globalStyles} from '../../../styles/globalStyles';
import {calcFileSize} from '../../../utils/calcFileSize';

interface Props {
  onUpload: (file: AttachmentModel) => void;
}

const UpLoadFileComponent = (props: Props) => {
  const {onUpload} = props;
  const [file, setFile] = useState<DocumentPickerResponse>();
  const [isVisiableModalUpload, setIsVisiableModalUpload] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentModel>();

  useEffect(() => {
    file && handleUploadFileToStorage();
  }, [file]);

  useEffect(() => {
    if (attachmentFiles) {
      onUpload(attachmentFiles);
      setIsVisiableModalUpload(false);
      setAttachmentFiles(undefined);
      setProgressUpload(0);
    }
  }, [attachmentFiles]);

  const handleUploadFileToStorage = () => {
    if (file) {
      setIsVisiableModalUpload(true);
      const path = `/documents/${file.name}`;

      const res = storage().ref(path).putFile(file.uri);

      res.on('state_changed', (snapshot: any) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setProgressUpload(progress);
      });

      res.then(() => {
        storage()
          .ref(path)
          .getDownloadURL()
          .then(url => {
            const data: AttachmentModel = {
              name: file.name ?? '',
              url,
              size: file.size ?? 0,
            };
            setAttachmentFiles(data);
          });
      });

      res.catch((err: any) => {
        console.log(err.message);
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          DocumentPicker.pick({
            allowMultiSelection: false,
            type: [
              DocumentPicker.types.xls,
              DocumentPicker.types.pdf,
              DocumentPicker.types.doc,
            ],
          }).then(res => {
            setFile(res[0]);
          })
        }>
        <DocumentUpload size={24} color={colors.white} />
      </TouchableOpacity>
      <Modal
        visible={isVisiableModalUpload}
        animationType="slide"
        style={{flex: 1}}
        transparent>
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: `${colors.gray}80`,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.8,
              height: 'auto',
              padding: 12,
              backgroundColor: colors.white,
              borderRadius: 12,
            }}>
            <TitleComponent text="Upload File" color={colors.bgColor} />
            <SpaceComponent height={12} />
            <View>
              <TextComponent
                color={colors.bgColor}
                flex={0}
                text={file?.name ?? ''}
              />
              <TextComponent
                color={colors.gray2}
                text={`${calcFileSize(file?.size ?? 0)}`}
                flex={0}
              />
            </View>
            <RowComponent>
              <View style={{flex: 1, marginRight: 12}}>
                <Slider
                  value={progressUpload}
                  renderThumbComponent={() => null}
                  trackStyle={{height: 6, borderRadius: 12}}
                  minimumTrackTintColor={colors.green}
                  maximumTrackTintColor={colors.desc}
                />
              </View>
              <TextComponent
                text={`${Math.floor(progressUpload * 100)}%`}
                flex={0}
                color={colors.bgColor}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UpLoadFileComponent;

const styles = StyleSheet.create({});
