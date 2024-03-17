/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  if (req.method !== 'GET') {
    res.status(405).send({
      message: 'Only GET requests allowed',
    });
    return;
  }

  const {
    id,
  } = req.query;

  try {
    const data = await fetch(`https://desu.me/manga/api/${id}`, {
      method: 'GET',
      headers: req.headers as any,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: null });
  }
}
