import { PrismaClient } from '@prisma/client';

(async () => {
  const prisma = new PrismaClient();

  await prisma.transaction.deleteMany();
  await prisma.transactionType.deleteMany();

  const transferTypes = [
    { code: 'TB', name: 'Transferencia Bancaria' },
    { code: 'PF', name: 'Pagos de facturas' },
    { code: 'RTC', name: 'Recargas de teléfono celular' },
    { code: 'PC', name: 'Pagos de comercios' },
    { code: 'RE', name: 'Retiros de efectivo' },
  ];

  await prisma.transactionType.createMany({
    data: transferTypes,
  });
})();
