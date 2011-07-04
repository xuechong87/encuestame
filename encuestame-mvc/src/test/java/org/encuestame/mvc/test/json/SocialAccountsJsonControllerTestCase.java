
package org.encuestame.mvc.test.json;

import org.encuestame.mvc.test.config.AbstractJsonMvcUnitBeans;
import org.encuestame.persistence.domain.security.Account;
import org.encuestame.persistence.domain.security.SocialAccount;
import org.encuestame.persistence.domain.security.UserAccount;
import org.junit.Before;
import org.junit.Ignore;

/**
 * Social Account Json Service Test Cases.
 * @author Picado, Juan juanATencuestame.org
 * @since  Feb 19, 2011 13:20:58 AM
 */
@Ignore
public class SocialAccountsJsonControllerTestCase extends AbstractJsonMvcUnitBeans{

    /** {@link Account}. **/
    private Account user;

    private SocialAccount socialTwitterAccount;

      @Before
      public void beforeSocialTest(){
          this.user = createAccount();
          final UserAccount account = createUserAccount("jota 1", user);
          this.socialTwitterAccount = createDefaultSettedSocialAccount(account);
      }
}
