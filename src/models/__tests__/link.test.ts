import Link from '../link.model';
import { ILink } from '../../types';

describe('Link Model', () => {
  it('Should throw validation error', () => {
    expect.assertions(1);

    const link: ILink = new Link({});

    return link
      .validate()
      .catch(e =>
        expect(e.message).toMatch(
          'Link validation failed: ipAddress: Path `ipAddress` is required., hash: Path `hash` is required., url: Path `url` is required.',
        ),
      );
  });
});
