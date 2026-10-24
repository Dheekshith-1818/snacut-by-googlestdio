import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reserveCredit,
  commitCredit,
  releaseCredit,
  validateImageFileMetadata,
  CreditState,
} from '../src/lib/accountingLogic';

test('reserves credit from daily allowance when daily limit has headroom', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 2,
    purchasedCredits: 10,
    reservedCredits: 0,
  };

  const res = reserveCredit(initial);
  assert.equal(res.allowed, true);
  assert.equal(res.source, 'daily_quota');
  assert.equal(res.newReservedCredits, 1);
});

test('reserves credit from purchased credits when daily allowance is exhausted', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 5,
    purchasedCredits: 10,
    reservedCredits: 0,
  };

  const res = reserveCredit(initial);
  assert.equal(res.allowed, true);
  assert.equal(res.source, 'purchased_credits');
  assert.equal(res.newReservedCredits, 1);
});

test('rejects reservation when both daily allowance and purchased credits are zero', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 5,
    purchasedCredits: 0,
    reservedCredits: 0,
  };

  const res = reserveCredit(initial);
  assert.equal(res.allowed, false);
  assert.equal(res.error, 'INSUFFICIENT_CREDITS');
});

test('commits credit correctly: increments dailyUsed and decrements reservation', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 1,
    purchasedCredits: 10,
    reservedCredits: 1,
  };

  const after = commitCredit(initial, 'daily_quota');
  assert.equal(after.dailyUsed, 2);
  assert.equal(after.reservedCredits, 0);
  assert.equal(after.purchasedCredits, 10);
});

test('commits purchased credit: decrements balance and decrements reservation', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 5,
    purchasedCredits: 10,
    reservedCredits: 1,
  };

  const after = commitCredit(initial, 'purchased_credits');
  assert.equal(after.dailyUsed, 5);
  assert.equal(after.reservedCredits, 0);
  assert.equal(after.purchasedCredits, 9);
});

test('releases reservation safely on job failure without altering balance', () => {
  const initial: CreditState = {
    dailyLimit: 5,
    dailyUsed: 3,
    purchasedCredits: 10,
    reservedCredits: 1,
  };

  const after = releaseCredit(initial);
  assert.equal(after.dailyUsed, 3);
  assert.equal(after.reservedCredits, 0);
  assert.equal(after.purchasedCredits, 10);
});

test('validates file mime types strictly', () => {
  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/jpeg', sizeBytes: 500000 }).valid,
    true
  );
  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/png', sizeBytes: 500000 }).valid,
    true
  );
  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/webp', sizeBytes: 500000 }).valid,
    true
  );
  assert.equal(
    validateImageFileMetadata({ mimeType: 'application/pdf', sizeBytes: 500000 }).valid,
    false
  );
  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/gif', sizeBytes: 500000 }).valid,
    false
  );
});

test('enforces 10 MB maximum file size limit', () => {
  const validSize = 9.9 * 1024 * 1024;
  const excessiveSize = 10.5 * 1024 * 1024;

  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/jpeg', sizeBytes: validSize }).valid,
    true
  );
  assert.equal(
    validateImageFileMetadata({ mimeType: 'image/jpeg', sizeBytes: excessiveSize }).valid,
    false
  );
});

test('enforces 5000x5000 max dimension constraint', () => {
  assert.equal(
    validateImageFileMetadata({
      mimeType: 'image/jpeg',
      sizeBytes: 1000000,
      width: 4800,
      height: 3200,
    }).valid,
    true
  );
  assert.equal(
    validateImageFileMetadata({
      mimeType: 'image/jpeg',
      sizeBytes: 1000000,
      width: 5200,
      height: 3000,
    }).valid,
    false
  );
});
