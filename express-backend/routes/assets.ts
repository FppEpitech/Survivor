import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from '../prismaClient'

router.get('/:uuid', async (req: Request, res: Response) => {
    const { uuid } = req.params;

    try {
        const image = await prisma.image.findUnique({
            where: { uuid },
        });

        if (image) {
            res.setHeader('Content-Type', 'image/png');
            res.send(image.data);
        } else {
            res.status(404).send('Image non trouvée');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image:', error);
        res.status(500).send('Erreur du serveur');
    }
});

export default router;
