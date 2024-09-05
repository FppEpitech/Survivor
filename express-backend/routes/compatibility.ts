import { Router, Request, Response } from 'express';

const router = Router();
import prisma from '../prismaClient'

type CompatibilityType = {
  [key: string]: {
    [key: string]: number;
  };
};

const compatibility: CompatibilityType = {
  Aries: { Taurus: 0.5, Gemini: 0.7, Cancer: 0.4, Leo: 0.8, Virgo: 0.6, Libra: 0.5, Scorpio: 0.4, Sagittarius: 0.9, Capricorn: 0.4, Aquarius: 0.7, Pisces: 0.3 },
  Taurus: { Aries: 0.5, Gemini: 0.6, Cancer: 0.8, Leo: 0.6, Virgo: 0.8, Libra: 0.7, Scorpio: 0.5, Sagittarius: 0.6, Capricorn: 0.7, Aquarius: 0.4, Pisces: 0.8 },
  Gemini: { Aries: 0.7, Taurus: 0.6, Cancer: 0.5, Leo: 0.8, Virgo: 0.7, Libra: 0.9, Scorpio: 0.4, Sagittarius: 0.8, Capricorn: 0.5, Aquarius: 0.9, Pisces: 0.6 },
  Cancer: { Aries: 0.4, Taurus: 0.8, Gemini: 0.5, Leo: 0.6, Virgo: 0.8, Libra: 0.5, Scorpio: 0.9, Sagittarius: 0.4, Capricorn: 0.7, Aquarius: 0.5, Pisces: 0.7 },
  Leo: { Aries: 0.8, Taurus: 0.6, Gemini: 0.8, Cancer: 0.6, Virgo: 0.5, Libra: 0.8, Scorpio: 0.7, Sagittarius: 0.9, Capricorn: 0.6, Aquarius: 0.7, Pisces: 0.4 },
  Virgo: { Aries: 0.6, Taurus: 0.8, Gemini: 0.7, Cancer: 0.8, Leo: 0.5, Libra: 0.6, Scorpio: 0.7, Sagittarius: 0.5, Capricorn: 0.9, Aquarius: 0.6, Pisces: 0.5 },
  Libra: { Aries: 0.5, Taurus: 0.7, Gemini: 0.9, Cancer: 0.5, Leo: 0.8, Virgo: 0.6, Scorpio: 0.6, Sagittarius: 0.7, Capricorn: 0.5, Aquarius: 0.8, Pisces: 0.6 },
  Scorpio: { Aries: 0.4, Taurus: 0.5, Gemini: 0.4, Cancer: 0.9, Leo: 0.7, Virgo: 0.7, Libra: 0.6, Sagittarius: 0.5, Capricorn: 0.7, Aquarius: 0.6, Pisces: 0.9 },
  Sagittarius: { Aries: 0.9, Taurus: 0.6, Gemini: 0.8, Cancer: 0.4, Leo: 0.9, Virgo: 0.5, Libra: 0.7, Scorpio: 0.5, Capricorn: 0.4, Aquarius: 0.7, Pisces: 0.6 },
  Capricorn: { Aries: 0.4, Taurus: 0.7, Gemini: 0.5, Cancer: 0.7, Leo: 0.6, Virgo: 0.9, Libra: 0.5, Scorpio: 0.7, Sagittarius: 0.4, Aquarius: 0.6, Pisces: 0.5 },
  Aquarius: { Aries: 0.7, Taurus: 0.4, Gemini: 0.9, Cancer: 0.5, Leo: 0.7, Virgo: 0.6, Libra: 0.8, Scorpio: 0.6, Sagittarius: 0.7, Capricorn: 0.6, Pisces: 0.4 },
  Pisces: { Aries: 0.3, Taurus: 0.8, Gemini: 0.6, Cancer: 0.7, Leo: 0.4, Virgo: 0.5, Libra: 0.6, Scorpio: 0.9, Sagittarius: 0.6, Capricorn: 0.5, Aquarius: 0.4 }
};

router.get('/:id1/:id2', async (req: Request, res: Response) => {
  const id1 = parseInt(req.params.id1);
  const id2 = parseInt(req.params.id2);

  if (isNaN(id1) || isNaN(id2)) {
    return res.status(400).json({ error: 'Invalid customer IDs' });
  }

  try {
    const [customer1, customer2] = await Promise.all([
      prisma.customer.findUnique({ where: { id: id1 } }),
      prisma.customer.findUnique({ where: { id: id2 } }),
    ]);

    if (!customer1 || !customer2) {
      return res.status(404).json({ error: 'One or both customers not found' });
    }

    const sign1 = customer1.astrological_sign as keyof CompatibilityType;
    const sign2 = customer2.astrological_sign as keyof CompatibilityType;
    const compatibilityScore = compatibility[sign1]?.[sign2] || 0;

    res.status(200).json({
      customer1AstrologicalSign: sign1,
      customer2AstrologicalSign: sign2,
      compatibilityScore: compatibilityScore * 100,
    });
  } catch (error) {
    console.error('Error retrieving customers:', error);
    res.status(500).json({ error: 'Error retrieving customers' });
  }
});

export default router;
