import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import api, { pesanError } from '../lib/api';
import Screen from '../components/Screen';
import ContentCard from '../components/ContentCard';

export default function Notifikasi() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ambil, lalu tandai dilihat
    api
      .get('/notifications')
      .then(({ data }) => {
        setItems(data.items);
        return api.put('/notifications/seen');
      })
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen loading={loading} error={error}>
      {items.length === 0 && <Text>Belum ada konten baru sejak terakhir kamu cek.</Text>}
      {items.map((c) => (
        <ContentCard key={c._id} content={c} />
      ))}
    </Screen>
  );
}
